import { ActiveFarmProvider } from "./context/activeFarmContext";
import AppRoutes from "./routes/routes";


export default function App() {
  return (
    <div>
      <ActiveFarmProvider>
        <AppRoutes/>
      </ActiveFarmProvider>
        
    </div>
  )
}


