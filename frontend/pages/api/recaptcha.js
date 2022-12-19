const handler = (req, res) => {
  if (req.method === "POST") {
    try {
      return fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_PRIVATE_KEY}&response=${req.body.gRecaptchaToken}`,
      })
        .then((reCaptchaRes) => reCaptchaRes.json())
        .then((reCaptchaRes) => {
          console.log(
            reCaptchaRes,
            "Response from Google reCaptcha verification API"
          );
          if (reCaptchaRes?.score > 0.5) {
            res.status(200).json({
              status: "success",
              message: "Complain submitted successfully",
            });
          } else {
            res.status(200).json({
              status: "failure",
              message: "Google ReCaptcha Failure",
            });
          }
        });
    } catch (err) {
      res.status(405).json({
        status: "failure",
        message: "Error submitting the complain form",
      });
    }
  } else {
    res.status(405);
    res.end();
    return resolve();
  }
};

export default handler;