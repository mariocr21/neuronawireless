export const formatDateTime = (value) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatRelativeNumber = (value, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return Number(value).toFixed(digits);
};

export const formatMetric = (value, unit = "", digits = 1) => {
  const numeric = formatRelativeNumber(value, digits);
  return numeric === "--" ? "--" : `${numeric}${unit ? ` ${unit}` : ""}`;
};
