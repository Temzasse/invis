import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '~styles/styled';

export function SplashScreen() {
  return (
    <Wrapper
      key="splash-screen"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Logo
        width="382"
        height="147"
        viewBox="0 0 382 147"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.8257 87.7672V144.32H0.694824V43.7817H34.993V62.8945H36.0403C38.2221 56.5236 42.0621 51.5272 47.5603 47.9054C53.1021 44.2836 59.5603 42.4727 66.9348 42.4727C74.0476 42.4727 80.2221 44.109 85.4585 47.3817C90.7385 50.6108 94.8185 55.0617 97.6985 60.7345C100.622 66.4072 102.062 72.8872 102.018 80.1745V144.32H65.8876V87.7672C65.9312 82.7927 64.6657 78.8872 62.0912 76.0508C59.5603 73.2145 56.0257 71.7963 51.4876 71.7963C48.5203 71.7963 45.9239 72.4508 43.6985 73.7599C41.5166 75.0254 39.8366 76.8581 38.6585 79.2581C37.4803 81.6145 36.8694 84.4508 36.8257 87.7672Z"
          fill="#F4F82B"
        />
        <path
          d="M219.089 43.7817L185.314 144.32H143.423L109.649 43.7817H147.613L163.845 110.284H164.893L181.125 43.7817H219.089Z"
          fill="#F4F82B"
        />
        <path
          d="M230.876 144.32V43.7817H267.007V144.32H230.876Z"
          fill="#F4F82B"
        />
        <path
          d="M378.824 76.509H345.573C345.399 74.4581 344.679 72.6908 343.413 71.2072C342.148 69.7236 340.511 68.589 338.504 67.8036C336.541 66.9745 334.359 66.5599 331.959 66.5599C328.861 66.5599 326.199 67.1272 323.973 68.2617C321.748 69.3963 320.657 71.0108 320.701 73.1054C320.657 74.589 321.29 75.9636 322.599 77.229C323.951 78.4945 326.548 79.4763 330.388 80.1745L350.81 83.8399C361.108 85.7163 368.766 88.8799 373.784 93.3308C378.846 97.7381 381.399 103.651 381.442 111.069C381.399 118.225 379.261 124.444 375.028 129.724C370.839 134.96 365.101 139.018 357.813 141.898C350.57 144.734 342.301 146.153 333.006 146.153C317.646 146.153 305.624 143.011 296.941 136.727C288.301 130.444 283.479 122.153 282.475 111.854H318.344C318.824 115.04 320.395 117.505 323.057 119.251C325.762 120.953 329.166 121.804 333.268 121.804C336.584 121.804 339.311 121.236 341.45 120.102C343.631 118.967 344.744 117.353 344.788 115.258C344.744 113.338 343.784 111.811 341.908 110.676C340.075 109.542 337.195 108.625 333.268 107.927L315.464 104.785C305.21 102.996 297.53 99.5927 292.424 94.5745C287.319 89.5563 284.788 83.0981 284.831 75.1999C284.788 68.2181 286.621 62.3054 290.33 57.4617C294.082 52.5745 299.428 48.8654 306.366 46.3345C313.348 43.7599 321.617 42.4727 331.173 42.4727C345.704 42.4727 357.159 45.4836 365.537 51.5054C373.959 57.5272 378.388 65.8617 378.824 76.509Z"
          fill="#F4F82B"
        />
        <path
          d="M236.374 28.4654C239.865 31.6945 244.054 33.309 248.941 33.309C253.872 33.309 258.061 31.6945 261.508 28.4654C264.999 25.2363 266.745 21.3527 266.745 16.8145C266.745 12.2763 264.999 8.39267 261.508 5.16358C258.061 1.93449 253.872 0.319946 248.941 0.319946C244.054 0.319946 239.865 1.93449 236.374 5.16358C232.883 8.39267 231.137 12.2763 231.137 16.8145C231.137 21.3527 232.883 25.2363 236.374 28.4654Z"
          fill="#46F4FF"
        />
        <path
          d="M5.90312 28.4654C9.39402 31.6945 13.5831 33.309 18.4704 33.309C23.4013 33.309 27.5904 31.6945 31.0377 28.4654C34.5286 25.2363 36.274 21.3527 36.274 16.8145C36.274 12.2763 34.5286 8.39267 31.0377 5.16358C27.5904 1.93449 23.4013 0.319946 18.4704 0.319946C13.5831 0.319946 9.39402 1.93449 5.90312 5.16358C2.41221 8.39267 0.666748 12.2763 0.666748 16.8145C0.666748 21.3527 2.41221 25.2363 5.90312 28.4654Z"
          fill="#46F4FF"
        />
      </Logo>
    </Wrapper>
  );
}

export function useSplashScreen() {
  const [visible, setVisible] = useState(true);

  // Show splash screen for a second before showing the app
  // so that it doesn't flash on the screen.
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return visible;
}

const Wrapper = styled(motion.div, {
  height: '100vh',
  fixedFill: true,
  flexCenter: true,
  backgroundColor: '$background',
});

const Logo = styled('svg', {
  width: 'calc(130px - env(safe-area-inset-bottom) / 2)', // TODO: figure out correct equation for width
  height: 'auto',
});
