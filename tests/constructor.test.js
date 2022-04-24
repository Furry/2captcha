import Captcha from "../dist/index";

test("Creates a base Solver & Solver.Pingback instance.", () => {
    const token = "test"
    const solver = new Captcha.Solver(token);
    const pingback = new Captcha.Pingback(token);

    expect(solver.token).toBe("test");
    expect(pingback.solver.token).toBe("test");
})