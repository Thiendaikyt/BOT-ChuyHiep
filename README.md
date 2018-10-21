# bot nodejs heroku by chuyhiep

Code demo tại [botcamxuc.net](http://botcamxuc.net/).

Hỗ trợ thêm tại facebook [Chụy Hiệp](https://fb.com/itvn90).

## Cài đặt và chạy thử tại máy cá nhân

Bạn cần cài đặt [Node.js](http://nodejs.org/)  và  [Heroku CLI](https://cli.heroku.com/) và [Git] (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

Mở cmd chạy command sau:
```sh
$ git clone https://github.com/hjephb90/BOT-ChuyHiep.git # lấy bản code mẫu
$ cd BOT-ChuyHiep
$ npm install
$ npm start
```

Ứng dụng sẽ chạy tại [localhost:5000](http://localhost:5000/).

## Đưa code lên Heroku

Mở cmd chạy command sau:
```
$ heroku create myapp #myapp là tên app tại heroku
$ git push heroku master
$ heroku open
```

## Tài liệu tham khảo

Bạn có thể tìm thêm các hướng dẫn của heroku:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
