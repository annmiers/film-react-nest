import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
    let logger: TskvLogger;
    let writeSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new TskvLogger();
        writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
    });

    afterEach(() => {
        writeSpy.mockRestore();
    });

    it('should format log as TSKV (tab-separated key=value)', () => {
        logger.log('Hello', 'world');

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const output = writeSpy.mock.calls[0][0] as string;

        expect(output).toContain('\t');
        expect(output).toMatch(/timestamp=.+\tlevel=log\tmessage=Hello\t/);
        expect(output.endsWith('\n')).toBe(true);

        const fields = output.trim().split('\t');
        const keyValuePairs = fields.map(f => f.split('=', 2));
        const obj = Object.fromEntries(keyValuePairs);

        expect(obj.level).toBe('log');
        expect(obj.message).toBe('Hello');
    });
});