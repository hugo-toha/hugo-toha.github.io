---
title: Thao tác tệp
weight: 40
menu:
  notes:
    name: Thao tác tệp
    identifier: notes-go-advanced-files
    parent: notes-go-advanced
    weight: 10
---

<!-- Condition -->
{{< note title="Condition">}}

```go
if day == "sunday" || day == "saturday" {
  rest()
} else if day == "monday" && isTired() {
  groan()
} else {
  work()
}
```

```go
if _, err := doThing(); err != nil {
  fmt.Println("Uh oh")
```

{{< /note >}}