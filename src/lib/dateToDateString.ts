const dateToDateString = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const pMonth = month.toString().padStart(2, '0');
  const pDay = day.toString().padStart(2, '0');
  const newPaddedDate = `${pDay}-${pMonth}-${year}`;
  return newPaddedDate;
};

export default dateToDateString;
