'use strict';

class AnalysisPlotter {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
    }

    plot(data) {
        const points = this.generatePoints(data);

        if (this.chart) {
            this.chart.destroy();
        }

        let title = '';
        if (this.canvas.id === 'deflection_plot') {
            title = 'Deflection (mm)';
        } else if (this.canvas.id === 'shear_force_plot') {
            title = 'Shear Force (kN)';
        } else if (this.canvas.id === 'bending_moment_plot') {
            title = 'Bending Moment (kNm)';
        }

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: title,
                    data: points,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Position (m)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: title
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }

    generatePoints(data) {
        const points = [];
        const numPoints = 100;
        const totalSpan = (data.beam.primarySpan + (data.beam.secondarySpan || 0)) * 1000;

        for (let i = 0; i <= numPoints; i++) {
            const x = (i / numPoints) * totalSpan;
            const result = data.equation(x);
            points.push({ x: result.x, y: result.y });
        }

        return points;
    }
}