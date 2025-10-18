const MongoConText = require("../../config/mongodb");
const Constant = require("../../config/constant");
const { ObjectId } = require("mongodb");

class SC {
    constructor(context){
        this.context = context
    }
    
    async getInstance(){
        if (!this.db) {
            this.db = await MongoConText.getInstance();
        }
        return this.db;
    }

    async insert(data){
        const db = await this.getInstance();
        data.created_at = new Date();
        data.updated_at = new Date();
        const result = await db.collection('suku_cadang').insertOne(data);
        return this.show(result.insertedId);
    }

    async list(filter, sort, limit = 0){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        var result 
        if (limit > 0) {
            result = await db.collection('suku_cadang').find(filter).sort(sort).limit(limit);
        } else {
            result = await db.collection('suku_cadang').find(filter).sort(sort);
        }
        return result.toArray();
    }

    async show(id){
        const db = await this.getInstance();
        const result = await db.collection('suku_cadang').findOne({_id:new ObjectId(id), deleted_at:{$exists:false}});
        return result;
    }

    async findOne(filter, projection = {}){
        const db = await this.getInstance();
        filter.deleted_at = {$exists:false}
        const result = await db.collection('suku_cadang').findOne(filter, {projection:projection});
        return result;
    }

    async update(id, upd){
        const db = await this.getInstance();
        id.deleted_at = {$exists:false}
        upd.$set.updated_at = new Date();
        await db.collection('suku_cadang').updateOne(id,upd);
        const show = await this.show(id._id);
        return show;
    }


    async delete(id){
        const db = await this.getInstance();
        var update = {$set:{deleted_at:new Date()}};
        const result = await db.collection('suku_cadang').updateOne({_id:new ObjectId(id), deleted_at:{$exists : false}},update);
        // var message = Constant.FAILED_DELETE_DATA;
        // var dlt = result.result;
        // if (dlt.nModified == 1 && dlt.ok == 1) {
            var message = Constant.SUCCESS_DELETE_DATA;
        // }
        return message;
    }

    
    async addHistorySukuCadang(data){
        const db = await this.getInstance();
        data.created_at = new Date();
        data.updated_at = new Date();
        const result = await db.collection('history_suku_cadang').insertOne(data);
        return result;
    }

    async showSukuCadangActivity(id){
        const db = await this.getInstance();
        const result = await db.collection('history_suku_cadang').aggregate([
            {
                $addFields: {
                sukucadang_objId: { $toObjectId: "$suku_cadang_id" },
                user_objId: { $toObjectId: "$user_id" },
                metadata_objId: { $toObjectId: "$metadata_id" }
                }
            },
            {
                $match : {_id: id}
            },
            {
                $lookup : {
                    from : 'suku_cadang',
                    localField : 'sukucadang_objId',
                    foreignField : '_id',
                    as : 'suku_cadang'
                }
            },
            { $lookup : {
                from : 'officer',
                localField : 'user_objId',
                foreignField : '_id',
                as : 'officer'
            }},
            {$lookup : {
                from : 'metadata',
                localField : 'metadata_objId',
                foreignField : '_id',
                as : 'stasiun'
            }},
            {
                $unwind : {
                    path : '$suku_cadang',
                    preserveNullAndEmptyArrays : true
                }
            }
        ]).toArray();
        return result;
    }

    // async historySukuCadang(filter, sort, limit = 0){
    //     const db = await this.getInstance();
    //     filter.deleted_at = {$exists:false}
    //     var result 
    //     if (limit > 0) {
    //         result = await db.collection('history_suku_cadang').aggregate([
    //         {
    //             $addFields: {
    //             sukucadang_objId: { $toObjectId: "$suku_cadang_id" },
    //             user_objId: { $toObjectId: "$user_id" },
    //             metadata_objId: { $toObjectId: "$metadata_id" }
    //             }
    //         },
    //         {
    //             $match : filter
    //         },
    //         {
    //             $lookup : {
    //                 from : 'suku_cadang',
    //                 localField : 'sukucadang_objId',
    //                 foreignField : '_id',
    //                 as : 'suku_cadang'
    //             }
    //         },
    //         { $lookup : {
    //             from : 'officer',
    //             localField : 'user_objId',
    //             foreignField : '_id',
    //             as : 'officer'
    //         }},
    //         {$lookup : {
    //             from : 'metadata',
    //             localField : 'metadata_objId',
    //             foreignField : '_id',
    //             as : 'stasiun'
    //         }},
    //         {
    //             $unwind : {
    //                 path : '$suku_cadang',
    //                 preserveNullAndEmptyArrays : true
    //             }
    //         },
    //         { $sort : sort },
    //         { $limit : limit }
    //     ]).toArray();
    //     } else {
    //         result = await db.collection('history_suku_cadang').aggregate([
    //         {
    //             $addFields: {
    //             sukucadang_objId: { $toObjectId: "$suku_cadang_id" },
    //             user_objId: { $toObjectId: "$user_id" },
    //             metadata_objId: { $toObjectId: "$metadata_id" }
    //             }
    //         },
    //         {
    //             $match : filter
    //         },
    //         {
    //             $lookup : {
    //                 from : 'suku_cadang',
    //                 localField : 'sukucadang_objId',
    //                 foreignField : '_id',
    //                 as : 'suku_cadang'
    //             }
    //         },
    //         { $lookup : {
    //             from : 'officer',
    //             localField : 'user_objId',
    //             foreignField : '_id',
    //             as : 'officer'
    //         }},
    //         {$lookup : {
    //             from : 'metadata',
    //             localField : 'metadata_objId',
    //             foreignField : '_id',
    //             as : 'stasiun'
    //         }},
    //         {
    //             $unwind : {
    //                 path : '$suku_cadang',
    //                 preserveNullAndEmptyArrays : true
    //             }
    //         },
    //         { $sort : sort }
    //     ]).toArray();
    //     }
    //     return result.toArray();
    // }
    async historySukuCadang(filter, sort, limit = 0) {
        const db = await this.getInstance();
        filter.deleted_at = { $exists: false };
        // pipeline dasar
        const pipeline = [
            {
            $addFields: {
                sukucadang_objId: {
                $convert: {
                    input: "$suku_cadang_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                },
                user_objId: {
                $convert: {
                    input: "$user_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                },
                metadata_objId: {
                $convert: {
                    input: "$metadata_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                }
            }
            },
            {
            $lookup: {
                from: "suku_cadang",
                localField: "sukucadang_objId",
                foreignField: "_id",
                as: "suku_cadang"
            }
            },
            {
            $lookup: {
                from: "officer",
                localField: "user_objId",
                foreignField: "_id",
                as: "officer"
            }
            },
            {
            $lookup: {
                from: "metadata",
                localField: "metadata_objId",
                foreignField: "_id",
                as: "stasiun"
            }
            },
            {
            $unwind: {
                path: "$suku_cadang",
                preserveNullAndEmptyArrays: true
            }
            },
            { $match: filter },
            { $sort: sort }
        ];

        // tambahin limit kalau ada
        if (limit > 0) {
            pipeline.push({ $limit: limit });
        }
        
        // langsung return hasil
        return db.collection("history_suku_cadang").aggregate(pipeline).toArray();
}   

 async downloadHistorySukuCadang(filter, sort, limit = 0) {
        const db = await this.getInstance();
        filter.deleted_at = { $exists: false };
        // pipeline dasar
        const pipeline = [
            {
            $addFields: {
                sukucadang_objId: {
                $convert: {
                    input: "$suku_cadang_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                },
                user_objId: {
                $convert: {
                    input: "$user_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                },
                metadata_objId: {
                $convert: {
                    input: "$metadata_id",
                    to: "objectId",
                    onError: null,
                    onNull: null
                }
                }
            }
            },
            {
            $lookup: {
                from: "suku_cadang",
                localField: "sukucadang_objId",
                foreignField: "_id",
                as: "suku_cadang"
            }
            },
            {
            $lookup: {
                from: "officer",
                localField: "user_objId",
                foreignField: "_id",
                as: "officer"
            }
            },
            {
            $lookup: {
                from: "metadata",
                localField: "metadata_objId",
                foreignField: "_id",
                as: "stasiun"
            }
            },
            {
            $unwind: {
                path: "$suku_cadang",
                preserveNullAndEmptyArrays: true
            }
            },
            { $match: filter },
            { $sort: sort },
            { $project: { 
                "nama sukucadang": "$suku_cadang.nama", 
                "merek sukucadang": "$suku_cadang.merek", 
                "kode sukucadang": "$suku_cadang.kode", 
                "qty": 1, 
                "jenis": 1, 
                "keterangan": 1, 
                "tanggal": 1, 
                "user": { $arrayElemAt: ["$officer.name", 0] }, 
                "stasiun": { $arrayElemAt: ["$stasiun.stasiun_pj", 0] },
                "kode site": { $arrayElemAt: ["$stasiun.kode", 0] }

            } }
        ];

        // console.log(pipeline)

        // tambahin limit kalau ada
        if (limit > 0) {
            pipeline.push({ $limit: limit });
        }
        
        // langsung return hasil
        return db.collection("history_suku_cadang").aggregate(pipeline).toArray();
}   

async rekapSukuCadangActivity(startDate, endDate){
    console.log(startDate, endDate);
        const db = await this.getInstance();
        const result = await db.collection("history_suku_cadang").aggregate([
            {
                $match: {
                transaction_date: {
                    $gte: startDate,
                    $lte: endDate
                }
                }
            },
            {
                $addFields: {
                sukucadang_objId: {
                    $toObjectId: "$suku_cadang_id"
                }
                }
            },
            {
                $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                    _id: {
                    suku_cadang_id: "$sukucadang_objId",
                    jenis: "$jenis"
                    },
                    totalQty: {
                    $sum: "$qty"
                    }
                }
            },
            {
                $group:
                /**
                 * _id: The id of the group.
                 * fieldN: The first field name.
                 */
                {
                    _id: "$_id.suku_cadang_id",
                    inbound: {
                    $sum: {
                        $cond: [
                        {
                            $eq: ["$_id.jenis", "inbound"]
                        },
                        "$totalQty",
                        0
                        ]
                    }
                    },
                    outbound: {
                    $sum: {
                        $cond: [
                        {
                            $eq: ["$_id.jenis", "outbound"]
                        },
                        "$totalQty",
                        0
                        ]
                    }
                    }
                }
            },
            {
                $lookup: {
                from: "suku_cadang",
                localField: "_id",
                foreignField: "_id",
                as: "suku_cadang"
                }
            },
            { $unwind: "$suku_cadang" },
            {
                $project: {
                _id: 0,
                kode: "$suku_cadang.kode",
                nama: "$suku_cadang.nama",
                merek: "$suku_cadang.merek",
                inbound: 1,
                outbound: 1,
                stock_akhir: "$suku_cadang.quantity"
                }
            }
            ]);
            // console.log(result);
                return result.toArray();
            }
}
module.exports = SC;