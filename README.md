# react-native-mmstorage

## Getting started

`$ yarn add react-native-mmstorage`

## Usage
```javascript
import MMStorage from 'react-native-mmstorage';
```



### APIS

initMMStorage(ids?: string[]) ⚠️ 该方法需要在App入口处全局执行一次。

> 默认将会使用单个存储实例进行读写、如果对于不同业务数据需要分别使用各自存储实例进行存储，则需要在App入口文件处先初始化实例。每个实例对应一个 id (字符串类型)

setStringifyValue(key:string,value:any,id?:string)

> 传入任意类型对象、最终将会以字符串类型写入磁盘。id为存储实例ID，不传则使用默认实例。

getParsedValue(key:string,id?:string)

> 该方法应配合 **setStringifyValue** 方法使用、读取到数据后将parse成相应数据类型对象

setValue(key:string,value:any,preciseType?:PreciseType,id?:string)

> PreciseType : 'DOUBLE' | 'FLOAT' | 'INT' | 'BOOLEAN' | 'STRING'
>
> 当需要更精细化控制存储的值类型时可以使用该方法、存入对应精确类型数据。
>
> INT类型对应存入的是 int64类型数值
>
> 默认为 'STRING'

getValue(key:string,preciseType?:PreciseType,id?:string)

> 该方法应当配合 setValue 使用、在明确存入的数据类型时，可使用该方法获取到对应值。
>
> 默认 'STRING'

hasKey(key:string,id?:string)

> 查询是否存在对应的 key

delValue(key:string,id?:string)

> 删除对应key值

delAllValue(id?:string)

> 删除全部key值、不传id则默认执行的是默认存储实例



### 示例

```typescript
useEffect(() => {
		let user = {
			id: Math.floor(Math.random() * 1000000),
			name: 'lily',
			age: 23,
			sex: 1
		}
		MMStorage.setStringifyValue("user", user);
		MMStorage.getParsedValue("user").then((value) => {
			console.log("user: ", value);
		})
		MMStorage.hasKey('user').then(rs => {
			console.log('before delete ', rs);
		})
		MMStorage.delAllValue();
		MMStorage.hasKey('user').then(rs => {
			console.log('after delete ', rs);
		})
}, [])
```

