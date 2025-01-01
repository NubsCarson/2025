import React, { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';
import styled, { keyframes, css } from 'styled-components';
import confetti from 'canvas-confetti';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  50% { text-shadow: 0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4); }
  100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
`;

const GlobalContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // For smooth scrolling on iOS
`;

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(
    -45deg,
    #000428,
    #004e92,
    #2c3e50,
    #3498db,
    #2980b9
  );
  background-size: 400% 400%;
  background-attachment: fixed;
  animation: ${css`${gradientAnimation}`} 15s ease infinite;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
  padding: 1rem 1rem 8rem 1rem;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    padding: 0.5rem 0.5rem 7rem 0.5rem;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.large ? '6rem' : '3rem'};
  margin-bottom: 2rem;
  text-align: center;
  animation: ${css`${glow}`} 2s ease-in-out infinite;
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    font-size: ${props => props.large ? '4rem' : '2.5rem'};
    margin-bottom: 1.5rem;
    padding: 15px 30px;
  }

  @media (max-width: 480px) {
    font-size: ${props => props.large ? '3rem' : '2rem'};
    margin-bottom: 1rem;
    padding: 10px 20px;
  }
`;

const CountdownDisplay = styled.div`
  font-size: 10rem;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  display: flex;
  gap: 20px;
  animation: ${css`${float}`} 3s ease-in-out infinite;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  min-width: 180px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    min-width: 140px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    min-width: 120px;
    padding: 10px;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }
`;

const TimeValue = styled.span`
  font-size: 8rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }

  @media (max-width: 480px) {
    font-size: 4rem;
  }
`;

const TimeLabel = styled.span`
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-top: 10px;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-top: 0;
  }
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 1rem 0 2rem 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 10px 20px;
    margin: 0.75rem 0 1.5rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 8px 16px;
    margin: 0.5rem 0 1rem 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

const LiveClock = styled.div`
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    font-size: 3rem;
    padding: 15px 25px;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    padding: 10px 15px;
    margin-bottom: 0.5rem;
  }

  span.time {
    font-family: 'Arial', sans-serif;
    letter-spacing: 4px;
    display: block;
    margin-top: 10px;

    @media (max-width: 480px) {
      letter-spacing: 2px;
    }
  }

  span.label {
    font-size: 2rem;
    opacity: 0.8;
    display: block;
    text-transform: uppercase;
    letter-spacing: 2px;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;

  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 8px;
  }
`;

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const SocialLinksLabel = styled.span`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-right: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 480px) {
    font-size: 1rem;
    width: 100%;
    text-align: center;
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const SocialLink = styled.a`
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

const Copyright = styled.div`
  opacity: 0.7;
  font-size: 1rem;
`;

const MessageContainer = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 1rem auto 2rem auto;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);

  @media (max-width: 768px) {
    margin: 1rem 0.5rem 1.5rem 0.5rem;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    margin: 0.5rem 0.5rem 1rem 0.5rem;
    padding: 0.75rem;
  }
`;

const Message = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Signature = styled.span`
  display: block;
  margin-top: 1rem;
  font-style: italic;
  opacity: 0.9;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem 0;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 0.75rem 0 1.5rem 0;
  }

  @media (max-width: 480px) {
    margin: 0.5rem 0 1rem 0;
    gap: 0.5rem;
  }
`;

function App() {
  const [isNewYear, setIsNewYear] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef(null);
  const musicRef = useRef(null);
  const celebrationRef = useRef(null);
  
  // Set target time to midnight PST
  const targetDate = new Date('January 1, 2025 00:00:00 PST');

  useEffect(() => {
    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    // Add floating party emojis
    const emojis = ['🎉', '🎊', '✨', '🎈', '🎉'];
    const container = document.querySelector('#party-container');
    
    const elements = emojis.map((emoji, index) => {
      const element = document.createElement('div');
      element.innerHTML = emoji;
      element.style.position = 'absolute';
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      element.style.fontSize = '2.5rem';
      element.style.opacity = '0.7';
      element.style.transform = 'translateY(0)';
      element.style.transition = 'transform 3s ease-in-out';
      element.style.animationDelay = `${index * 0.5}s`;
      element.style.zIndex = '0';
      container.appendChild(element);
      return element;
    });

    // Animate emojis
    const animateEmojis = () => {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            element.style.transform = 'translateY(0)';
          }, 1500);
        }, index * 500);
      });
    };

    const animationInterval = setInterval(animateEmojis, 3000);

    return () => {
      clearInterval(animationInterval);
      elements.forEach(el => el.remove());
    };
  }, []);

  useEffect(() => {
    if (isNewYear) {
      // Launch confetti
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since they fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { 
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { 
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);

      // Play celebration sound if enabled
      if (isSoundEnabled && celebrationRef.current) {
        celebrationRef.current.play().catch(e => console.log('Celebration playback failed:', e));
      }

      return () => clearInterval(interval);
    }
  }, [isNewYear, isSoundEnabled]);

  const renderer = ({ hours, minutes, seconds }) => (
    <CountdownDisplay>
      <TimeUnit>
        <TimeValue>{String(hours).padStart(2, '0')}</TimeValue>
        <TimeLabel>Hours</TimeLabel>
      </TimeUnit>
      <TimeUnit>
        <TimeValue>{String(minutes).padStart(2, '0')}</TimeValue>
        <TimeLabel>Minutes</TimeLabel>
      </TimeUnit>
      <TimeUnit>
        <TimeValue>{String(seconds).padStart(2, '0')}</TimeValue>
        <TimeLabel>Seconds</TimeLabel>
      </TimeUnit>
    </CountdownDisplay>
  );

  const handleComplete = () => {
    setIsNewYear(true);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    // If turning off sound while celebration is playing, pause it
    if (isSoundEnabled && celebrationRef.current) {
      celebrationRef.current.pause();
      celebrationRef.current.currentTime = 0;
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play().catch(e => console.log('Music playback failed:', e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    }).replace(/\s+/g, ' ');
  };

  return (
    <GlobalContainer>
      <AppContainer id="party-container">
        {!isNewYear ? (
          <>
            <LiveClock>
              <span className="label">Current Time</span>
              <span className="time">{formatTime(currentTime)}</span>
            </LiveClock>
            <Title>Countdown to 2025! 🎉</Title>
            <Countdown 
              date={targetDate}
              renderer={renderer}
              onComplete={handleComplete}
            />
            <ButtonContainer>
              <Button onClick={toggleSound}>
                {isSoundEnabled ? '🔊 Midnight Sound On' : '🔇 Midnight Sound Off'}
              </Button>
              <Button onClick={toggleMusic}>
                {isMusicPlaying ? '⏸️ Pause Music' : '▶️ Play Music'}
              </Button>
            </ButtonContainer>
            <MessageContainer>
              <Message>
                As we bid farewell to 2024, I reflect on the paths that have diverged and the friends who've taken different roads. 
                But tonight, looking around this room, my heart is full. To those of you here with me now – your presence means everything. 
                You're not just friends; you're the family we choose, the ones who stuck around through thick and thin. 
                While some friendships may fade, the bonds we share in this moment are what make life beautiful and worth celebrating. 
                Here's to us, to the memories we've made, and to all the new ones we'll create together in 2025. 
                Thank you for being here, for being you, and for making every moment count. 
                🫂✨💫
                <Signature>- Nubs</Signature>
              </Message>
            </MessageContainer>
          </>
        ) : (
          <>
            <LiveClock>
              <span className="label">Current Time</span>
              <span className="time">{formatTime(currentTime)}</span>
            </LiveClock>
            <Title large>Happy New Year 2025! 🎉</Title>
            <ButtonContainer>
              <Button onClick={toggleSound}>
                {isSoundEnabled ? '🔊 Midnight Sound On' : '🔇 Midnight Sound Off'}
              </Button>
              <Button onClick={toggleMusic}>
                {isMusicPlaying ? '⏸️ Pause Music' : '▶️ Play Music'}
              </Button>
            </ButtonContainer>
            <MessageContainer>
              <Message>
                As we bid farewell to 2024, I reflect on the paths that have diverged and the friends who've taken different roads. 
                But tonight, looking around this room, my heart is full. To those of you here with me now – your presence means everything. 
                You're not just friends; you're the family we choose, the ones who stuck around through thick and thin. 
                While some friendships may fade, the bonds we share in this moment are what make life beautiful and worth celebrating. 
                Here's to us, to the memories we've made, and to all the new ones we'll create together in 2025. 
                Thank you for being here, for being you, and for making every moment count. 
                🫂✨💫
                <Signature>- Nubs</Signature>
              </Message>
            </MessageContainer>
          </>
        )}
        <audio 
          ref={audioRef} 
          src={`${process.env.PUBLIC_URL}/auld-lang-syne.mp3`}
          type="audio/mpeg"
          preload="auto"
        />
        <audio 
          ref={musicRef} 
          src={`${process.env.PUBLIC_URL}/song.mp3`}
          type="audio/mpeg"
          preload="auto"
          loop
        />
        <audio 
          ref={celebrationRef} 
          src={`${process.env.PUBLIC_URL}/celebrate.mp3`}
          type="audio/mpeg"
          preload="auto"
        />
        <Footer>
          <SocialLinksContainer>
            <SocialLinksLabel>Social Links:</SocialLinksLabel>
            <SocialLink href="https://github.com/NubsCarson" target="_blank" rel="noopener noreferrer">
              <span>GitHub</span> 👨‍💻
            </SocialLink>
            <SocialLink href="https://twitter.com/MoneroSolana" target="_blank" rel="noopener noreferrer">
              <span>Twitter</span> 🐦
            </SocialLink>
          </SocialLinksContainer>
          <Copyright>© 2024 Nubs. All rights reserved.</Copyright>
        </Footer>
      </AppContainer>
    </GlobalContainer>
  );
}

export default App;
