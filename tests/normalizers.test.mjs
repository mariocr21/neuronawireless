import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeAlertRule,
  normalizeNotification,
  normalizeStationSummary,
  normalizeWidget,
  normalizeWidgetSensor,
  normalizeSensorSeries,
} from "../src/domain/normalizers.js";

test("normalizeStationSummary maps real station payload without inventing metrics", () => {
  const result = normalizeStationSummary({
    id: 7,
    name: "Rancho Norte",
    is_online: true,
    last_online: "2026-03-09 18:00:00",
    crop: { name: "Tomate" },
    sensors: [
      {
        id: 1,
        name: "Temperatura ambiente",
        units: "C",
        visible: true,
        last_data: { register_value: 29.4, register_date: "2026-03-09 18:00:00" },
      },
    ],
  });

  assert.equal(result.id, 7);
  assert.equal(result.status, "online");
  assert.equal(result.cropName, "Tomate");
  assert.equal(result.metrics.temperature.value, 29.4);
  assert.equal(result.signal, null);
  assert.equal(result.battery, null);
});

test("normalizeAlertRule keeps activation state and condition summary", () => {
  const result = normalizeAlertRule({
    id: 3,
    title: "Humedad baja",
    is_active: true,
    conditions: [
      { id: 11, comparator: "<", value: 30, station: "Lote 1", sensor: 9 },
    ],
  });

  assert.equal(result.id, 3);
  assert.equal(result.isActive, true);
  assert.match(result.conditionSummary, /1 condicion/i);
});

test("normalizeNotification maps read state and user-facing title", () => {
  const result = normalizeNotification({
    id: "n1",
    data: {
      title: "Alerta critica",
      body: "Temperatura fuera de rango",
      station_name: "Rancho Norte",
      type: "critical",
    },
    created: "9:00 am - 9 de marzo del 2026",
    created_humans: "hace 1 minuto",
    read: null,
  });

  assert.equal(result.id, "n1");
  assert.equal(result.read, false);
  assert.equal(result.level, "critical");
  assert.equal(result.stationName, "Rancho Norte");
});

test("normalizeWidget and normalizeWidgetSensor preserve dashboard contracts", () => {
  const widget = normalizeWidget({
    id: 4,
    title: "Clima diario",
    description: "Resumen",
    type_chart: "temperature",
    chart_order: 2,
    sub_days: 7,
    min: 0,
    max: 50,
    status: true,
  });
  const sensor = normalizeWidgetSensor({
    id: 10,
    sensor_id: 12,
    sensor_name: "Temperatura ambiente",
    station_name: "Lote 2",
    color: "#00ff00",
    dashboard_chart_id: 4,
  });

  assert.equal(widget.type, "temperature");
  assert.equal(widget.order, 2);
  assert.equal(widget.isActive, true);
  assert.equal(sensor.widgetId, 4);
  assert.equal(sensor.color, "#00ff00");
});

test("normalizeSensorSeries exposes chart points and stats", () => {
  const result = normalizeSensorSeries({
    id: 55,
    name: "Temp (Lote 1)",
    sensor_name: "Temp",
    station_name: "Lote 1",
    units: "C",
    min: 22,
    max: 31,
    avg: 26.5,
    data: [
      { x: "03-09-2026 12:00:00 GMT", y: 26.1 },
      { x: "03-09-2026 13:00:00 GMT", y: 26.8 },
    ],
  });

  assert.equal(result.id, 55);
  assert.equal(result.points.length, 2);
  assert.equal(result.stats.max, 31);
  assert.equal(result.unitLabel, "C");
});
