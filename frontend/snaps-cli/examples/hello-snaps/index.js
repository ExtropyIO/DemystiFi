wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      return wallet.send({
        method: 'alert',
        params: [`Hellooooo Tom, ${originString}!`]
      })
    default:
      throw new Error('Method not found.')
  }
})
