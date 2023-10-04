import ReactPlayer, { ReactPlayerProps } from "react-player";
import { forwardRef, ForwardedRef } from "react";
import "./Player.css";

export const Player: React.FC<
  {
    ref: ForwardedRef<ReactPlayer | null>;
  } & ReactPlayerProps
> = forwardRef((props: ReactPlayerProps, ref) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        {...props}
        className="react-player"
        width="100%"
        height="100%"
        ref={ref}
      />
    </div>
  );
});
