
jest.mock('../FirebaseService');
import { getFirebaseInstance } from '../FirebaseService';

import { ConfigService } from '../ConfigService';

const mockedGetFirebaseInstance = getFirebaseInstance as jest.Mock<any>

const MOCKVAL = "val123";
const val = jest.fn(() => MOCKVAL);

mockedGetFirebaseInstance.mockImplementation(() => (
     {
        database: jest.fn(() => (
             {
                ref: jest.fn(() => (
                    {
                        once: jest.fn(() => (
                            {
                                val: val
                            }
                        ))
                    }
                ))
            }
        ))
    }

));

describe("ConfigService", () => {

    test('getInstance', () => {

        const configService = ConfigService.getInstance();
        expect(configService).toBeDefined();


    });

    test('getProperty', async () => {
    
        const configService = ConfigService.getInstance();
        const propVal = await configService.getProperty("key1");
        expect(val).toHaveBeenCalledTimes(1);
        expect(propVal).toBe(MOCKVAL);
    
    });

});


