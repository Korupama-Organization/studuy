import React, { createContext, useContext } from 'react';

interface NavigationContextType {
  goToSlide: (index: number) => void;
  isSlideMode: boolean;
}

export const NavigationContext = createContext<NavigationContextType>({
  goToSlide: () => {},
  isSlideMode: false,
});

export const useNavigation = () => useContext(NavigationContext);
