
import { Route,Routes } from 'react-router-dom'
import './App.css'
import { MainHome } from './components/mainhome/mainhome'
import { Lobby } from './pages/lobby/lobby'
import { MainQuiz } from './components/mainquiz/mainquiz'






function App() {


return(
<>
<Routes>
    <Route path="/" element={<MainHome />} />
        <Route path="/lobby" element={<Lobby/>} />
         <Route path="/singlequiz" element={<MainQuiz />} />
        <Route path="/quiz/:roomId" element={<MainQuiz />} />
</Routes>

   
    </>
)
 
}

export default App
