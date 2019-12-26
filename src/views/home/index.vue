<template>
  <div class="layout__page">
    <div class="layout__header">
      <timer />
    </div>
    <div class="layout__body">
      <div v-if="!notebooks.length && hasRequest"
           class="list-no-content-tip">
        时不我待，抓紧建个任务吧~
      </div>
      <vue-better-scroll ref="scroll"
                         :pullDownRefresh="scrollOptions.pullDownRefreshObj"
                         :pullUpLoad="scrollOptions.pullUpLoadObj"
                         @pulling-down="getNotebookList({ page: 1 })"
                         @pulling-up="getNotebookList({ page: query.page + 1 })">
        <div class="home__notebook-list">
          <div v-for="notebook in notebooks"
               class="home__notebook-card-wrapper"
               :key="notebook.id">
            <card :notebook="notebook"
                  @edit-notebook="handleEditNotebookClick"
                  @edit-note="handleEditNoteClick"
                  @toggle-done-status="toggleDoneStatus"
                  @update-note-order="updateNoteOrder"
                  @create-note="handleCreateNoteClick"></card>
          </div>
        </div>
      </vue-better-scroll>
    </div>
    <div class="home__button--create-notebook"
         id="fixed-bottom">
      <van-button type="primary"
                  size="normal"
                  icon="plus"
                  round
                  @click="createNoteBook">新建任务集</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import notebookInteractor from '@/use-cases/notebook-interactor';
import noteInteractor from '@/use-cases/note-interactor';
import LocalConfig from '@/config.json';
import { INotebook, INote } from '@/types';

import timer from './widgets/timer.vue';
import card from './widgets/card.vue';
import { NavBar, Button, List, Checkbox } from 'vant';

Vue.use(NavBar)
  .use(Button)
  .use(List)
  .use(Checkbox);

@Component({
  components: { timer, card }
})
export default class Home extends Vue {
  private notebooks: INotebook[] = [];

  private query = {
    page: 1,
    count: LocalConfig.ListQueryCount
  };

  private listTotal = 0;

  private hasRequest = false;

  private scrollOptions = {
    pullDownRefreshObj: true,
    pullUpLoadObj: {
      threshold: 0,
      txt: {
        more: '加载更多',
        noMore: '没有更多数据了'
      }
    }
  };

  private async getNotebookList(query: ListQuery) {
    try {
      this.query = Object.assign({}, this.query, query);

      const { data, total } = await notebookInteractor.getNotebookList(
        this.query
      );

      this.listTotal = total;

      if (this.query.page === 1) {
        this.notebooks = data;
      } else {
        this.notebooks = [...this.notebooks, ...data];
      }

      if (this.notebooks.length >= this.listTotal) {
        (this.$refs.scroll as any).forceUpdate(false);
      } else {
        (this.$refs.scroll as any).forceUpdate(true);
      }

      this.hasRequest = true;
    } catch (error) {
      console.log(error);
    }
  }

  private async toggleDoneStatus(noteId: number, notebookId: number) {
    try {
      if (notebookId && noteId) {
        await noteInteractor.toggleDoneStatus(notebookId, noteId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async updateNoteOrder({ id, notes }: INotebook) {
    try {
      if (id && notes) {
        await notebookInteractor.updateNoteOrder(id, notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async createNoteBook() {
    this.$router.push({
      name: 'notebook.create'
    });
  }

  private async handleEditNotebookClick(id: number) {
    this.$router.push({
      name: 'notebook.edit',
      params: {
        id: JSON.stringify(id)
      }
    });
  }

  private async handleCreateNoteClick(notebookId: number) {
    this.$router.push({
      name: 'note.create',
      query: {
        notebookId: JSON.stringify(notebookId)
      }
    });
  }

  private async handleEditNoteClick(noteId: number, notebookId: number) {
    this.$router.push({
      name: 'note.edit',
      params: {
        id: JSON.stringify(noteId)
      },
      query: {
        notebookId: JSON.stringify(notebookId)
      }
    });
  }

  private async created() {
    this.$bus.on('notebook-change', () => {
      this.getNotebookList(this.query);
    });

    this.getNotebookList({ page: 1, count: LocalConfig.ListQueryCount });
  }
}
</script>
<style lang="less" scoped>
@import '~@/less/var.less';

.layout__header {
  padding: 60px 16px 0 16px;
  background: @background-color;
}

.home__notebook-list {
  padding: 56px 16px 0 16px;
}

.home__notebook-card-wrapper {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}

.home__button--create-notebook {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
