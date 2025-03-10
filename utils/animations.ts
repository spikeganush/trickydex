import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const useCardAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animateCard = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(0, { duration: 200 });
  };

  return { scale, opacity, animateCard };
};

export const useScoreAnimation = () => {
  const scale = useSharedValue(1);

  const animateScore = () => {
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
      scale.value = withSpring(1);
    });
  };

  return { scale, animateScore };
};

export const useLetterAnimation = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animateLetter = () => {
    scale.value = withSpring(1.5, { damping: 10, stiffness: 100 }, () => {
      scale.value = withSpring(1);
    });
    rotate.value = withTiming(360, { duration: 500, easing: Easing.linear });
  };

  return { scale, rotate, animateLetter };
};
