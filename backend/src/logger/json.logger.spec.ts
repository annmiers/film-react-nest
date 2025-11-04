import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
    let logger: JsonLogger;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new JsonLogger();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('should log message as valid JSON', () => {
        const message = 'Test message';
        logger.log(message, 'extra');

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        const logOutput = consoleLogSpy.mock.calls[0][0];
        const parsed = JSON.parse(logOutput);

        expect(parsed).toEqual({
            timestamp: expect.any(String),
            level: 'log',
            message: 'Test message',
            optionalParams: ['extra'],
        });
    });
});