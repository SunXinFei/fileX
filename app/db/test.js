const Database = require('better-sqlite3');

function eagleObjectId () {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

module.exports = extract;
function extract (libraryPath, callback) {
	try {
		console.time("New DB");
		var dbPath = libraryPath + '/Pixave';
		var db = new Database(dbPath, {});
		var medias = db.prepare('SELECT * FROM ZMEDIA').all();
		var mediaTags = db.prepare('SELECT * FROM ZMEDIATAGLIST').all();
		var tags = db.prepare('SELECT * FROM ZTAGS').all();
		var collections = db.prepare('SELECT * FROM ZCOLLECTIONS').all();
		console.timeEnd("New DB");

		console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
		console.log("载入 Pixave 资源库：%s", dbPath);

		console.time("Process Pixave");
		// 1. 建立文件夹列表
		var images = [];
		var folders = [];
		var foldersMapping = {};
		var collectionsMapping = {};

		// 建立数据结构关系
		collections.forEach(function (collection) {
			var id = collection.ZCOLLECTIONID;
			var pid = collection.ZCOLLECTIONPID;
			var name = collection.ZTITLE;
			var folderId = eagleObjectId();
			var folder = {
				id: folderId,
				name: name,
				children: [],
			};
			collectionsMapping[id] = folder;
			foldersMapping[folderId] = folder;
		});

		// 建立父子关系
		collections.forEach(function (collection) {
			var id = collection.ZCOLLECTIONID;
			var pid = collection.ZCOLLECTIONPID;
			var parent = collectionsMapping[pid];
			if (pid && parent) {
				parent.children.push(collectionsMapping[id]);
			}
		});

		// 建立第一层文件夹列表，将没有父亲的找出来
		collections.forEach(function (collection) {
			var id = collection.ZCOLLECTIONID;
			var pid = collection.ZCOLLECTIONPID;
			if (!pid) {
				folders.push(collectionsMapping[id]);
			}
		});

		// 此时 folders 基本已经是树状结构
		console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
		console.log("一共载入了 %d 张文件夹", folders.length);

		// 建立文件夹列表
		// ipcRenderer.send('new-folders-end', folders);

		// 2. 建立图片列表
		var mediasMapping = {};
		var imagesMapping = {};
		var tagsMapping = {};
		medias.forEach(function (media) {

			var id = media.ZMEDIAID;
			var name = media.ZMEDIATITLE;
			var url = media.ZMEDIAWEBURL || "";
			var isDeleted = media.ZMEDIAISDELETED === 1;
			var filePath = libraryPath + '/Masters/' + media.ZMEDIAPATH;
			var pid = media.ZMEDIAPID;
			var imageId = eagleObjectId();
			var createDate = Math.round (new Date((media.ZMEDIADATEIMPORTED + 978307200) * 1000));

			var image = {
				id: imageId,
				name: name,
				url: url,
				path: filePath,
				folders: [],
				tags: [],
				isDeleted: isDeleted,
				modificationTime: createDate,
			};

			// 添加 folder id
			if (pid && collectionsMapping[pid]) {
				var folder = collectionsMapping[pid];
				if (folder && folder.id) {
					image.folders.push(folder.id);
				}
			}
			mediasMapping[id] = image;
			imagesMapping[imageId] = image;
		});

		// 添加图片标签
		tags.forEach(function (tag) {
			tagsMapping[tag.ZTAGID] = tag;
		});

		mediaTags.forEach(function (tag) {
			var ZMEDIAID = tag.ZMEDIAID;
			var ZTAGID = tag.ZTAGID;
			var ZTITLE = tagsMapping[ZTAGID].ZTITLE;
			var image = mediasMapping[ZMEDIAID];
			image.tags.push(ZTITLE);
		});

		for (var i = 0; i < medias.length; i++) {
			var media = medias[i];
			images.push(mediasMapping[media.ZMEDIAID]);
		}
		console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
		console.log("一共载入了 %d 张图片", images.length);
		console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

		console.timeEnd("Process Pixave");
		// images.forEach(function (image) {
		// 	console.log(image);
		// });

		callback(undefined, {
			images: images,
			folders, folders
		});

		// 开始添加图片
		// for (var i = 0; i < images.length; i++) {
		// 	var image = images[i];
		// 	ipcRenderer.send("add-download-task-end");
		// 	addToProcessQueue(image);
		// }
	}
	catch (err) {
		console.log(err);
		callback({
			error: err
		});
	}
}