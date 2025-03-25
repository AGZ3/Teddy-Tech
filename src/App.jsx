import './App.css'
import Chat from './components/Chat.jsx';
import MainMenu from './components/MainMenu.jsx';

const App = () => {

  return (
    <div className='App'>
      <MainMenu />
      <div className='header'>
      </div>
      <Chat />
      <h5>Created by Alec Gomez</h5>

    </div>
  );
};

export default App;