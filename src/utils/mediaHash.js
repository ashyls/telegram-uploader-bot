import Media from "../database/model/media.js";
import crypto from 'crypto';

async function generateUrlHash(fileId){
    let isUnique = false;
    let hash;
        
    if (!isUnique) {
        hash = crypto.createHash('sha256')
                     .update(fileId + Date.now().toString())
                     .digest('hex')
                     .slice(0, 16);
                         
        const existingMedia = await Media.findOne({ hash });
        if (!existingMedia) {
            isUnique = true;
        }
    }

    return hash;
}

export default generateUrlHash;