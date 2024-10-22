const isAfterCurrentDate = (date: Date | string) => {
  const givenDate = new Date(date);
  const currentDate = new Date();

  givenDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return givenDate.getTime() < currentDate.getTime();
}

export { isAfterCurrentDate };
