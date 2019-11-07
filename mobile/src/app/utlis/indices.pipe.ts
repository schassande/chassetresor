import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'indices'
})
export class IndicesPipe implements PipeTransform {

    SEPARATOR = ' ';
    EMPTY_SPACE = '_';

    transform(indices: string, nbIndices: number) {

        const fullString: string = indices.trim().padEnd(nbIndices, this.EMPTY_SPACE);
        let result = '';

        for (let i = 0; i < fullString.length; i++) {
            result = result.concat(fullString[i]).concat(this.SEPARATOR);
        }
        return result.trim().toUpperCase();
    }
}