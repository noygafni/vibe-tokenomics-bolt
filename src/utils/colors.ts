export const memberColors = [
  '#00B8B8', // Turquoise
  '#FF7E3D', // Vibrant Orange
  '#FFD23F', // Golden Yellow
  '#FF3366', // Hot Pink
  '#7B2FBF', // Royal Purple
  '#1E3D59', // Deep Blue
  '#45CACD', // Light Turquoise
  '#FF9A5C', // Light Orange
  '#FFE175', // Light Yellow
  '#FF6B9B', // Light Pink
  '#9B4BDD', // Light Purple
  '#3A6B96', // Light Blue
];

export const getMemberColor = (index: number): string => {
  return memberColors[index % memberColors.length];
};