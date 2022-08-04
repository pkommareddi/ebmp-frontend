import "bootstrap/dist/css/bootstrap.min.css"
import LoginPage from "./LoginPage"
import Dashboard from "./Dashboard"

const code = new URLSearchParams(window.location.search).get("code")

function App() {
    return code ? (
        <>
            <Dashboard code={code} />
            
        </>
    ) : <LoginPage />
}

export default App