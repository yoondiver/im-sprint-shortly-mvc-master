const utils = require("../../modules/utils");
const { url: URLModel } = require("../../models");

module.exports = {
  get: async (req, res) => {
    const result = await URLModel.findAll();
    res.status(200).json(result);
  },
  post: (req, res) => {
    const { url } = req.body;

    if (!utils.isValidUrl(url)) {
      return res.sendStatus(400);
    }

    utils.getUrlTitle(url, (err, title) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }

      URLModel.findOrCreate({
        where: {
          url: url,
        },
        defaults: {
          title: title,
        },
      })
        .then(([result, created]) => {
          if (!created) {
            return res.status(201).json(result); // 생성
          }
          res.status(201).json(result); // 조회
        })
        .catch((error) => {
          console.log(error);
          res.sendStatus(500); // 서버 에러
        });
    });
  },
  redirect: (req, res) => {
    URLModel.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          return result.update({
            visits: result.visits + 1,
          });
        } else {
          res.sendStatus(204);
        }
      })
      .then((result) => {
        res.redirect(result.url);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  },
};
