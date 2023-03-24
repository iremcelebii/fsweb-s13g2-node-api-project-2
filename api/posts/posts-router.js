// posts için gerekli routerları buraya yazın

const express = require("express");
const postsModel = require("./posts-model");

const router = express.Router();
//!veya const router = require ("express").Router();

router.get("/", async (req, res) => {
  try {
    const posts = await postsModel.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    //!urlde parametrelerle gönderdiklerim  params dan bodyden gönderdiklerim body den
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    const post = req.body;
    if (post.title && post.contents) {
      //!insert bir obje alıyor parametre olarak
      const postId = await postsModel.insert(post);
      res.status(201).json({ ...postId, ...post });
      //!VEYA bu şekilde get id deki oblenin tamamı return ediliyor
      //   const postTam = await postsModel.findById(postId.id);
      //   res.status(201).json(postTam);
    } else {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

//!url de id parametresi varsa yapman gerekn ilk şey
//!finby ile ilgili objeyi bir değişkene atamak

router.put("/:id", async (req, res) => {
  try {
    let postExist = await postsModel.findById(req.params.id);
    if (postExist) {
      let update = req.body;
      if (update.title && update.contents) {
        await postsModel.update(req.params.id, update);
        //!güncellenmiş olanı almak için tekrar fndbyid yaparım
        let postGuncel = await postsModel.findById(req.params.id);
        res.json(postGuncel);
      } else {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      }
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let post = await postsModel.findById(req.params.id);
    if (post) {
      await postsModel.remove(req.params.id);
      res.json(post);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let post = await postsModel.findById(req.params.id);
    if (post) {
      let comments = await postsModel.findPostComments(req.params.id);
      res.json(comments);
    } else {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    }
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
