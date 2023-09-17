import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';
import './Player.css';

export const Player = (props: ReactPlayerProps) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer {...props} className="react-player" width="100%" height="100%" />
    </div>
  );
};
