import "./LoadingPage.css";
import "../../spritesheet/spritesheet.css";
import { CSSProperties, useEffect, useState, useRef } from "react";
import { iconIds } from "../../spritesheet/iconIds";

const RADIUS = 150;
const LOADING_TEXT = "Loading";
const NUM_DOTS = 5;
// get this from spritesheet icon dimension assume square
const ICON_WIDTH = 24;
const NUM_ICONS = 20;

interface IconStyleAndClass {
  classes: string;
  style: CSSProperties;
}

interface LoadingPageProps {
  loading: boolean;
  handleLPDoneClick: () => void;
}

// modification of
// https://stackoverflow.com/questions/39020670/rotate-objects-around-circle-using-css
const LoadingPage = ({ loading, handleLPDoneClick }: LoadingPageProps) => {
  const [iconContainerStyle, setIconContainerStyle] = useState<CSSProperties>({
    width: `${RADIUS * 2}px`,
    height: `${RADIUS * 2}px`,
    left: `calc(100vw * 0.5 - ${RADIUS}px)`,
    top: `calc(100vh * 0.5 - ${RADIUS}px)`,
  });
  const [itemStyles, setItemStyles] = useState<IconStyleAndClass[]>([
    { classes: "", style: {} },
  ]);
  const [loadingText, setLoadingText] = useState<string>(LOADING_TEXT);
  const pageRef = useRef<HTMLDivElement>(null);
  const [moveListenerAdded, setMoveListenerAdded] = useState<boolean>(false);
  const [countdownText, setCountdownText] =
    useState<string>("Redirecting in..");
  const countdownIntervalIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let textIntervalId: NodeJS.Timeout;
    if (!loading) {
      setLoadingText("Loaded!");
    } else {
      textIntervalId = setInterval(() => {
        setLoadingText((prev) => {
          if (prev.length >= LOADING_TEXT.length + NUM_DOTS) {
            return LOADING_TEXT;
          } else {
            return prev + ".";
          }
        });
      }, 400);
      createItemStyles();
    }

    return () => {
      clearInterval(textIntervalId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pageRef.current?.removeEventListener("mousemove", handleMove);
    };
  }, [loading]);

  useEffect(() => {
    let countdownNum = 5;
    if (!loading) {
      countdownIntervalIdRef.current = setInterval(() => {
        if (countdownNum === 0) {
          if (countdownIntervalIdRef.current) {
            clearInterval(countdownIntervalIdRef.current);
          }
          handleLPDoneClick();
        } else {
          setCountdownText(`Redirecting in..${countdownNum}`);
          countdownNum--;
        }
      }, 1000);
    }

    return () => {
      if (countdownIntervalIdRef.current) {
        clearInterval(countdownIntervalIdRef.current);
      }
    };
  }, [handleLPDoneClick, loading]);

  const createItemStyles = () => {
    const iconsToUse = [];

    // randomly get icons
    for (let i = 0; i < NUM_ICONS; i++) {
      const randomIcon = iconIds[Math.floor(Math.random() * iconIds.length)];
      iconsToUse.push(randomIcon);
    }

    let angle = 0;
    const step = (2 * Math.PI) / iconsToUse.length;
    const iconStylesAndClasses: IconStyleAndClass[] = [];

    for (const icon of iconsToUse) {
      const x = RADIUS + RADIUS * Math.cos(angle) - ICON_WIDTH * 0.5;
      const y = RADIUS + RADIUS * Math.sin(angle) - ICON_WIDTH * 0.5;
      angle += step;

      iconStylesAndClasses.push({
        classes: `costume ${icon} item`,
        style: { left: `${x}px`, top: `${y}px` },
      });
    }
    setItemStyles(iconStylesAndClasses);
  };

  const attachIconMover = () => {
    if (!moveListenerAdded) {
      setMoveListenerAdded(true);
      setIconContainerStyle((prev) => {
        return { ...prev, pointerEvents: "none" };
      });
      pageRef.current?.addEventListener("mousemove", (ev) => handleMove(ev));
    }
  };

  const handleMove = (e: globalThis.MouseEvent) => {
    setIconContainerStyle((prev) => {
      return { ...prev, top: e.clientY - RADIUS, left: e.clientX - RADIUS };
    });
  };

  const handleWaitClick = () => {
    if (countdownIntervalIdRef.current) {
      clearInterval(countdownIntervalIdRef.current);
      setCountdownText("Redirection stopped.");
    }
  };

  return (
    <div className="lp-page" ref={pageRef}>
      <div className="lp-loading-area">
        <h1>{loadingText}</h1>
        {!loading && (
          <>
            <div className="lp-countdown-container">
              <h2 className="lp-mr-10px">{countdownText}</h2>
              <button className="lp-btn lp-mr-10px" onClick={handleWaitClick}>
                Stop
              </button>
              <button className="lp-btn" onClick={handleLPDoneClick}>
                Let&apos;s Go!
              </button>
            </div>
          </>
        )}
      </div>
      <button
        id="lp-new-icons-btn"
        className="lp-btn"
        onClick={createItemStyles}
      >
        New Icons!
      </button>
      <div
        className="lp-icons-container"
        style={iconContainerStyle}
        onMouseEnter={attachIconMover}
      >
        {itemStyles.map((item, ind) => {
          return (
            <div key={ind} className={item.classes} style={item.style}></div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingPage;
