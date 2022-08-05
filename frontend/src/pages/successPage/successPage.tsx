import {BottomBuffer} from '../../components/bottomBuffer/bottomBuffer';
import {Footer} from '../../components/footer/footer';
import {Navbar} from '../../components/navbars/Navbar';

export const SuccessPage =
    () => {
      return <div>
        <div className='fillPage'>
          <Navbar type='home'></Navbar>
          <div style={{
            textAlign: 'center',
            position: 'absolute',
            width: '100vw',
            height: '88vh',
            top: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h1 className='pinkText'>Success!</h1>
          </div>
          <BottomBuffer></BottomBuffer>
        </div>
        <Footer></Footer>
      </div>;
    };
