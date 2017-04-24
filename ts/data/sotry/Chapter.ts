/**
 * Created by ShanFeng on 4/10/2017.
 */

namespace org.data {
    import Iterator = gnk.data.Iterator;
    export class Chapter extends Iterator<IScene> {
        constructor(private id:number, private parent:Chapter, arr) {
            super(arr);
        }
    }
}