
jest.mock('../FirebaseService');
import { getFirebaseInstance } from '../FirebaseService';

export const mockedGetFirebaseInstance = getFirebaseInstance as jest.Mock<any>

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