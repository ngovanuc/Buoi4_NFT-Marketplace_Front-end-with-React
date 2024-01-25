import { EthProvider } from "./contexts";
import { Demo } from "./components";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <EthProvider>
        <div className="text-dark">
          <Demo />
      </div>
    </EthProvider>
  );
}

export default App;
