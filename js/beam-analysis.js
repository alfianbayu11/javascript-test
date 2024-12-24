'use strict';

class Material {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }
}

class Beam {
    constructor(primarySpan, secondarySpan, material) {
        this.primarySpan = primarySpan;
        this.secondarySpan = secondarySpan;
        this.material = material;
    }
}
BeamAnalysis.analyzer.simplySupported = class {
    constructor(beam, load) {
        this.beam = beam;
        this.load = load;
    }

    getDeflectionEquation(beam, load) {
        return function (x) {
            const L = beam.primarySpan * 1000;
            const EI = beam.material.properties.EI;
            const w = load;


            if (x < 0 || x > L || !EI) return { x: x / 1000, y: 0 };


            const y = (w * x / (24 * EI)) *
                (Math.pow(L, 3) - 2 * L * Math.pow(x, 2) + Math.pow(x, 3));

            return {
                x: x / 1000,
                y: y * 1000
            };
        };
    }

    getBendingMomentEquation(beam, load) {
        return function (x) {
            const L = beam.primarySpan * 1000;
            const w = load;

            if (x < 0 || x > L) return { x: x / 1000, y: 0 };


            const y = (w * L * x / 2) - (w * Math.pow(x, 2) / 2);

            return {
                x: x / 1000,
                y: y / 1000000
            };
        };
    }

    getShearForceEquation(beam, load) {
        return function (x) {
            const L = beam.primarySpan * 1000;
            const w = load;

            if (x < 0 || x > L) return { x: x / 1000, y: 0 };


            const y = (w * L / 2) - (w * x);

            return {
                x: x / 1000,
                y: y / 1000
            };
        };
    }
};

BeamAnalysis.analyzer.twoSpanUnequal = class {
    constructor(beam, load) {
        this.beam = beam;
        this.load = load;
    }

    getDeflectionEquation(beam, load) {
        return function (x) {
            const L1 = beam.primarySpan * 1000;
            const L2 = (beam.secondarySpan || 0) * 1000;
            const EI = beam.material.properties.EI;
            const w = load;

            if (x < 0 || x > (L1 + L2) || !EI) return { x: x / 1000, y: 0 };

            let y;
            if (x <= L1) {

                const M = (w * L1 * L2) / (2 * (L1 + L2));
                y = (w * x / (24 * EI)) *
                    (Math.pow(L1, 3) - 2 * L1 * Math.pow(x, 2) + Math.pow(x, 3)) -
                    (M * Math.pow(x, 2)) / (2 * EI);
            } else {

                const x2 = x - L1;
                const M = (w * L1 * L2) / (2 * (L1 + L2));
                y = (w * x2 / (24 * EI)) *
                    (Math.pow(L2, 3) - 2 * L2 * Math.pow(x2, 2) + Math.pow(x2, 3)) -
                    (M * Math.pow(x2, 2)) / (2 * EI);
            }

            return {
                x: x / 1000,
                y: y * 1000
            };
        };
    }

    getBendingMomentEquation(beam, load) {
        return function (x) {
            const L1 = beam.primarySpan * 1000;
            const L2 = (beam.secondarySpan || 0) * 1000;
            const w = load;

            if (x < 0 || x > (L1 + L2)) return { x: x / 1000, y: 0 };

            let y;
            if (x <= L1) {

                const R1 = (w * L1 * (2 * L1 + L2)) / (2 * (L1 + L2));
                y = R1 * x - (w * Math.pow(x, 2) / 2);
            } else {

                const x2 = x - L1;
                const R2 = (w * L2 * (L1 + 2 * L2)) / (2 * (L1 + L2));
                y = R2 * x2 - (w * Math.pow(x2, 2) / 2);
            }

            return {
                x: x / 1000,
                y: y / 1000000
            };
        };
    }

    getShearForceEquation(beam, load) {
        return function (x) {
            const L1 = beam.primarySpan * 1000;
            const L2 = (beam.secondarySpan || 0) * 1000;
            const w = load;

            if (x < 0 || x > (L1 + L2)) return { x: x / 1000, y: 0 };

            let y;
            if (x <= L1) {

                const R1 = (w * L1 * (2 * L1 + L2)) / (2 * (L1 + L2));
                y = R1 - w * x;
            } else {

                const x2 = x - L1;
                const R2 = (w * L2 * (L1 + 2 * L2)) / (2 * (L1 + L2));
                y = R2 - w * x2;
            }

            return {
                x: x / 1000,
                y: y / 1000
            };
        };
    }
};