import math


def calculate_capacitor_correction(voltage, current, pfAwal, pfAkhir, frequency):
    # Rumus Power Factor Correction
    QAwal = voltage * current * math.sin(math.acos(pfAwal))
    QAkhir = voltage * current * math.sin(math.acos(pfAkhir))
    delta_Q = QAwal - QAkhir
    Q = delta_Q / (2 * math.pi * frequency * voltage**2)
    Q_microfarad = Q * 10**6
    return Q_microfarad