import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

export const SlideShowTest = () => {
  const images = [
    '/Hustlermy_header-01.jpg',
    '/Hustlermy_header2-01.jpg',
  ];

  return (
    <Slide transitionDuration={600}>
      <div className="each-slide-effect">
        <div style={{ 'backgroundImage': `url(${images[0]})`}}>
        </div>
      </div>
      <div className="each-slide-effect">
        <div style={{ 'backgroundImage': `url(${images[1]})` }}>
        </div>
      </div>
    </Slide>
  );
};