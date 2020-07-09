import { required, mustBeInteger, mustBeFloat, greaterThan, equalOrGreaterThan, mustBeUrl } from "./validator";

describe("Forms > Validators", () => {
  describe("Required validator", () => {
    it("Returns undefined for a non-empty string", () => {
      expect(required("Im not empty")).toBeUndefined();
    });

    it("Returns an error message for an empty string", () => {
      expect(required('')).toBeDefined();
    });

    it("Returns an error message for a string containing only spaces", () => {
      expect(required('   ')).toBeDefined();
    });
  });

  describe('mustBeInteger validator', () => {
    it('Returns undefined for an integer number string', () => {
      expect(mustBeInteger('10')).toBeUndefined()
    })

    it('Returns an error message for a float number', () => {
      expect(mustBeInteger('1.0')).toBeDefined()     
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeInteger('iamnotanumber')).toBeDefined()     
    })
  })
  
  describe('mustBeFloat validator', () => {
    it('Returns undefined for a float number string', () => {
      expect(mustBeFloat('1.0')).toBeUndefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeFloat('iamnotanumber')).toBeDefined()     
    })
  })

  describe('greaterThan validator', () => {
    it('Returns undefined for a number greater than minimum', () => {
      const minimum = Math.random()
      const number = (minimum + 1).toString()

      expect(greaterThan(minimum)(number)).toBeUndefined()
    })

    it('Returns an error message for a number less than minimum', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(greaterThan(minimum)(number)).toBeDefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(greaterThan(1)('imnotanumber')).toBeDefined()
    })
  })

  describe('equalOrGreaterThan validator', () => {
    it('Returns undefined for a number greater than minimum', () => {
      const minimum = Math.random()
      const number = (minimum + 1).toString()

      expect(equalOrGreaterThan(minimum)(number)).toBeUndefined()
    })

    it('Returns undefined for a number equal to minimum', () => {
      const minimum = Math.random()

      expect(equalOrGreaterThan(minimum)(minimum.toString())).toBeUndefined()
    })

    it('Returns an error message for a number less than minimum', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(equalOrGreaterThan(minimum)(number)).toBeDefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(equalOrGreaterThan(1)('imnotanumber')).toBeDefined()
    })
  })

  describe('mustBeUrl validator', () => {
    it('Returns undefined for a valid url', () => {
      expect(mustBeUrl('https://gnosis-safe.io')).toBeUndefined()
    })

    it('Returns an error message for an valid url', () => {
      expect(mustBeUrl('gnosis-safe')).toBeDefined()
    })
  })
});
