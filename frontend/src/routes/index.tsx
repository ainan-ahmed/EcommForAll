import {createFileRoute} from '@tanstack/react-router'
function HomePage() {
    return <div>Hello "/"!</div>
}

export const Route = createFileRoute('/')({
    component: HomePage,
})