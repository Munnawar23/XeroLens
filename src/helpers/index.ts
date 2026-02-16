import { Dimensions } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

/**
 * Calculates the width based on the percentage of the viewport width.
 * @param percentage The percentage of the viewport width (0-100).
 * @returns The calculated width in pixels.
 */
export const wp = (percentage: number) => {
    return (percentage * viewportWidth) / 100;
};

/**
 * Calculates the height based on the percentage of the viewport height.
 * @param percentage The percentage of the viewport height (0-100).
 * @returns The calculated height in pixels.
 */
export const hp = (percentage: number) => {
    return (percentage * viewportHeight) / 100;
};
