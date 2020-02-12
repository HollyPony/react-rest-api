export const mockFetch = impl => jest.fn().mockImplementation((...params) => {
  return impl(...params)
})

export const mockSuccess = result => mockFetch(url => Promise.resolve({
  ok: true,
  status: 200,
  url,
  json: () => result
}))

export const mockFail = (...params) => mockFetch(() =>
  Promise.reject(new TypeError(...params))
)
