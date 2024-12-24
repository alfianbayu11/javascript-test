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
                        },
                        min: 0,
                        max: this.getMaxX(data)
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

    getMaxX(data) {
        const condition = document.getElementById('condition').value;
        if (condition === 'simply-supported') {
            return data.beam.primarySpan;
        } else {
            return data.beam.primarySpan + (data.beam.secondarySpan || 0);
        }
    }

    generatePoints(data) {
        const points = [];
        const numPoints = 50; // Reduced number of points
        const maxX = this.getMaxX(data) * 1000; // Convert to mm

        // Generate points with safe step size
        const step = maxX / numPoints;
        for (let i = 0; i <= numPoints; i++) {
            const x = i * step;
            try {
                const result = data.equation(x);
                if (result && isFinite(result.x) && isFinite(result.y)) {
                    points.push(result);
                }
            } catch (e) {
                console.error('Error calculating point:', e);
            }
        }

        return points;
    }
}