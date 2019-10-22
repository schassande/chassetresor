import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'indices'
})
export class IndicesPipe implements PipeTransform{

    SEPARATOR: string = ' ';
    EMPTY_SPACE: string = '_';

    transform(indices: string, nbIndices: number) {

        let fullString: string = indices.trim().padEnd(nbIndices, this.EMPTY_SPACE);
        let result: string = '';

        for (var i = 0; i < fullString.length; i++) {
            result = result.concat(fullString[i]).concat(this.SEPARATOR);
        }

        return result.trim();
    }

}