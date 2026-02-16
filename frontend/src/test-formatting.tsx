import { Button, Text } from '@mantine/core';
import { useState } from 'react';

// Test file to demonstrate formatting workflow
export function TestComponent() {
  const [count,setCount]=useState(0)
  
  const handleClick=()=>{
      setCount(count+1)
  }

  return (
    <div>
        <Text>Count: {count}</Text>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  )
}
