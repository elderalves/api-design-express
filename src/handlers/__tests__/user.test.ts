import * as user from '../user';

describe('user handler', () => {
  it('should create a new user', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'password',
      },
    };

    // const res = {
    //   json: jest.fn(),
    // };
    const res = {json({token}) {
      expect(token).toBeTruthy();
    }}

    const newUser = await user.createNewUser(req, res, () => {});
  })
})