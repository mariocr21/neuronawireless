const sensorNameIncludes = (sensor, terms) => {
  const value = String(sensor?.name || "").toLowerCase();
  return terms.some((term) => value.includes(term));
};

const getSensorMetric = (sensors, terms) => {
  const sensor = sensors.find((item) => sensorNameIncludes(item, terms));
  const rawValue = sensor?.last_data?.register_value;

  return {
    sensorId: sensor?.id ?? null,
    name: sensor?.name ?? null,
    value:
      rawValue === null || rawValue === undefined || rawValue === "N/A"
        ? null
        : Number(rawValue),
    units: sensor?.units ?? "",
    updatedAt: sensor?.last_data?.register_date ?? sensor?.updated_at ?? null,
    visible: sensor?.visible ?? true,
  };
};

export const normalizeStationSummary = (station = {}) => {
  const sensors = Array.isArray(station.sensors) ? station.sensors : [];

  return {
    id: station.id,
    name: station.name || "Estacion sin nombre",
    status: station.is_online ? "online" : "offline",
    isOnline: Boolean(station.is_online),
    lastOnline: station.last_online || null,
    cropName: station.crop?.name || station.crop?.title || "Sin cultivo activo",
    battery: null,
    signal: null,
    metrics: {
      temperature: getSensorMetric(sensors, ["temp"]),
      humidity: getSensorMetric(sensors, ["hum", "ambient"]),
      soilMoisture: getSensorMetric(sensors, ["suelo", "soil"]),
    },
    sensors: sensors.map((sensor) => ({
      id: sensor.id,
      stationId: sensor.station_id,
      name: sensor.name,
      units: sensor.units || "",
      visible: sensor.visible ?? true,
      isOnline: sensor.is_online ?? false,
      minValue: sensor.min_value ?? null,
      maxValue: sensor.max_value ?? null,
      lastValue:
        sensor.last_data?.register_value === undefined ||
        sensor.last_data?.register_value === "N/A"
          ? null
          : Number(sensor.last_data.register_value),
      lastRegisteredAt: sensor.last_data?.register_date ?? null,
    })),
  };
};

export const normalizeAlertRule = (alert = {}) => ({
  id: alert.id,
  title: alert.title || "Alerta sin titulo",
  isActive: Boolean(alert.is_active ?? alert.active),
  isOn: Boolean(alert.is_on ?? alert.on),
  tracked: Boolean(alert.tracked),
  conditions: Array.isArray(alert.conditions) ? alert.conditions : [],
  conditionSummary: `${Array.isArray(alert.conditions) ? alert.conditions.length : 0} condicion(es)`,
});

export const normalizeNotification = (notification = {}) => {
  const data = notification.data || {};
  const type = String(data.type || data.level || "").toLowerCase();

  return {
    id: notification.id,
    title: data.title || "Evento del sistema",
    message: data.body || data.message || "Sin detalles disponibles.",
    stationName: data.station_name || data.station || "General",
    sensorName: data.sensor_name || null,
    createdLabel: notification.created || notification.created_humans || "",
    createdHuman: notification.created_humans || notification.created || "",
    read: Boolean(notification.read),
    level: type.includes("crit") ? "critical" : "warning",
  };
};

export const normalizeWidget = (widget = {}) => ({
  id: widget.id,
  title: widget.title || "Widget sin titulo",
  description: widget.description || "",
  type: widget.type_chart || widget.type || "line",
  order: Number(widget.chart_order || widget.order || 1),
  days: Number(widget.sub_days || widget.days || 1),
  min: widget.min === null || widget.min === undefined ? null : Number(widget.min),
  max: widget.max === null || widget.max === undefined ? null : Number(widget.max),
  isActive: Boolean(widget.status ?? widget.isActive),
});

export const normalizeWidgetSensor = (sensor = {}) => ({
  id: sensor.id,
  widgetId: sensor.dashboard_chart_id,
  sensorId: sensor.sensor_id,
  stationId: sensor.station_id ?? null,
  stationName: sensor.station_name || "Estacion",
  sensorName: sensor.sensor_name || "Sensor",
  color: sensor.color || "#59d94f",
});

export const normalizeSensorSeries = (sensor = {}) => ({
  id: sensor.id,
  name: sensor.name || `${sensor.sensor_name || "Sensor"} (${sensor.station_name || "Estacion"})`,
  sensorName: sensor.sensor_name || "Sensor",
  stationName: sensor.station_name || "Estacion",
  unitLabel: sensor.units || "",
  current:
    sensor.current === null || sensor.current === undefined || sensor.current === "N/A"
      ? null
      : Number(sensor.current),
  points: Array.isArray(sensor.data)
    ? sensor.data.map((point) => ({
        x: point.x,
        y: point.y === null || point.y === undefined ? null : Number(point.y),
      }))
    : [],
  stats: {
    min: sensor.min === null || sensor.min === undefined ? null : Number(sensor.min),
    max: sensor.max === null || sensor.max === undefined ? null : Number(sensor.max),
    avg: sensor.avg === null || sensor.avg === undefined ? null : Number(sensor.avg),
  },
  color: sensor.color || null,
});
