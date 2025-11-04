import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
    let logger: DevLogger;
    let writeSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new DevLogger();
        writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        writeSpy.mockRestore();
    });

    it('should be defined', () => {
        expect(logger).toBeDefined();
        expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should output log to stdout', () => {
        logger.log('Test message');

        expect(writeSpy).toHaveBeenCalled();
    });

    it('should have standard logger methods', () => {
        expect(typeof logger.log).toBe('function');
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.verbose).toBe('function');
    });
});