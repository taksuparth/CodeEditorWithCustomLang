type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type WithDefaultProps<P, DP extends Partial<P>> = Omit<P, keyof DP> &
  Required<Pick<P, Extract<keyof DP, keyof P>>>;