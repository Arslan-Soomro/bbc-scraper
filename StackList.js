class Bump{
    data;
    next;

    constructor(key){
        this.data = key;
    }
}


class StackList {
    head;
    size = 0;

    isEmpty(){
        return this.head == undefined;
    }

    isLastBump(item){
        return item.next == undefined;
    }

    pushi(item){
        if(this.isEmpty()){
            this.head = item;
            this.size++;
        }else{
            if(this.head?.data != undefined && item.data != this.head.data){
                item.next = this.head;
                this.head = item;
                this.size++;
            }
        }
    }

    push(str){
        this.pushi(new Bump(str));
    }

    popi(){
        if(!this.isEmpty()){
            const temp = this.head;
            if(this.head && this.head.next) this.head = this.head.next;
            else this.head = undefined;

            if(this.size > 0) this.size--;

            return temp;
        }else{
            console.log("@pop: List already empty");
        }

        return undefined;
    }

    pop(){
        if(!this.isEmpty()){
            const temp = this.head?.data;
            if(this.head && this.head.next) this.head = this.head.next;
            else this.head = undefined;

            if(this.size > 0) this.size--;

            return temp;
        }else{
            console.log("@pop: List already empty");
        }

        return undefined;
    }

    peek(){
        return this.head?.data ? this.head.data : undefined;
    }

    print(){
        if(!this.isEmpty()){
           let cur = this.head;
           while(cur){
            console.log(cur.data);
            if(this.isLastBump(cur)){
                break;
            }

            cur = cur.next;
           }

        }else{
            console.log("@print: List is empty.");
        }
    }
    
}

module.exports = StackList;