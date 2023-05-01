import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as uuid from 'uuid';
import * as fs from 'fs';
@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(
        'Faylni yozishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //DELETE
  async deleteFile(oldLink): Promise<boolean> {
    console.log(oldLink);
    try {
      const filePath = path.resolve(__dirname, '..', '..', 'static/' + oldLink);
      console.log(filePath);
      if (!fs.existsSync(filePath)) {
        return false;
      }
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      throw new HttpException(
        'Faylni o`zgartirishda hatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
