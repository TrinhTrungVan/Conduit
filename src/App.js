import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Switch from "./routes/Switch";

function App() {
    return (
        <div className='App'>
            <Header />
            <Switch />
            <Footer />
        </div>
    );
}

export default App;
