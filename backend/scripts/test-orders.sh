#!/usr/bin/env zsh
set -euo pipefail
HOST=${HOST:-http://localhost:8080}
API_USERNAME=${API_USERNAME:-admin}
API_PASSWORD=${API_PASSWORD:-password}
PRODUCT_ID=${PRODUCT_ID:-cf65db72-a37c-415f-832c-93dfff3adc5a}
VARIANT_ID=${VARIANT_ID:-4b6ae6d7-a859-4fce-ab06-4da2585a93e1}

print -- "Logging in as $API_USERNAME ..."
TOKEN=$(curl -sf -X POST "$HOST/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"'"$API_USERNAME"'","password":"'"$API_PASSWORD"'"}' | \
  python3 - <<'PY'
import sys, json
s=sys.stdin.read().strip()
try:
    print(json.loads(s).get("token",""))
except Exception:
    print("")
PY
)

if [[ -z "$TOKEN" ]]; then
  print -- "Failed to obtain token. Verify HOST=$HOST and credentials."
  exit 1
fi

print -- "Token acquired (len=${#TOKEN}). Creating order ..."
ORDER_RESP=$(curl -sf -X POST "$HOST/api/orders" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shippingAddress": "123 Test Street, Test City, TX 75001",
    "billingAddress": "123 Test Street, Test City, TX 75001",
    "paymentMethod": "COD",
    "orderNotes": "Please ring the bell.",
    "fromCart": false,
    "items": [
      {"productId":"'"$PRODUCT_ID"'","variantId":"'"$VARIANT_ID"'","quantity":1}
    ]
  }')
ORDER_ID=$(print -r -- "$ORDER_RESP" | python3 -c 'import sys, json; print(json.load(sys.stdin).get("id",""))')
print -- "Order created: $ORDER_ID"

print -- "Fetching order by id ..."
curl -sf "$HOST/api/orders/$ORDER_ID" -H "Authorization: Bearer $TOKEN" | jq -r '.id, .status, .totalAmount'

print -- "Listing orders ..."
curl -sf "$HOST/api/orders?page=0&size=5&sort=createdAt&direction=desc" -H "Authorization: Bearer $TOKEN" | jq '.content | length'

print -- "Has active orders?"
curl -sf "$HOST/api/orders/has-active" -H "Authorization: Bearer $TOKEN" | jq -r '.'

print -- "Recent orders (limit=5) ..."
curl -sf "$HOST/api/orders/recent?limit=5" -H "Authorization: Bearer $TOKEN" | jq 'length'

print -- "Cancelling order ..."
curl -sf -X POST "$HOST/api/orders/$ORDER_ID/cancel" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"reason":"Changed my mind"}' >/dev/null || true
print -- "Cancelled (if status allowed)."
